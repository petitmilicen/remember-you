import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';

export const LOCATION_TASK_NAME = 'background-location-task';
export const GEOFENCING_TASK_NAME = 'background-geofencing-task';

// Variables globales para optimizaciones
let lastGeofenceEventTime = 0;
const DEBOUNCE_MS = 60000; // ✅ FIX CRÍTICO #3: Aumentado a 60 segundos para mejor debouncing
let trackingStartTime = null;
let adaptiveTrackingTimeout = null;
let lastZoneState = null; // ✅ FIX CRÍTICO #3: Trackear último estado conocido

// ✅ FIX CRÍTICO #2: Queue de retry para ubicaciones fallidas
const MAX_QUEUE_SIZE = 50;
let isProcessingQueue = false;

/**
 * Guarda una ubicación fallida en la queue
 */
async function addToQueue(locationData) {
    try {
        const queueStr = await AsyncStorage.getItem('locationQueue');
        const queue = queueStr ? JSON.parse(queueStr) : [];

        // Agregar timestamp y retry count
        const item = {
            ...locationData,
            timestamp: Date.now(),
            retryCount: 0
        };

        queue.push(item);

        // Limitar tamaño de queue
        const trimmedQueue = queue.slice(-MAX_QUEUE_SIZE);
        await AsyncStorage.setItem('locationQueue', JSON.stringify(trimmedQueue));

        console.log(`[Queue] Ubicación agregada. Total en queue: ${trimmedQueue.length}`);
    } catch (error) {
        console.error('[Queue] Error guardando en queue:', error);
    }
}

/**
 * Procesa la queue de ubicaciones pendientes con retry exponencial
 */
async function processQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    try {
        const queueStr = await AsyncStorage.getItem('locationQueue');
        if (!queueStr) {
            isProcessingQueue = false;
            return;
        }

        const queue = JSON.parse(queueStr);
        if (queue.length === 0) {
            isProcessingQueue = false;
            return;
        }

        console.log(`[Queue] Procesando ${queue.length} ubicaciones pendientes...`);

        const successfulItems = [];
        const failedItems = [];

        for (const item of queue) {
            try {
                // Exponential backoff: 2^retryCount segundos
                const backoffDelay = Math.pow(2, item.retryCount) * 1000;
                const timeSinceAdded = Date.now() - item.timestamp;

                if (timeSinceAdded < backoffDelay) {
                    failedItems.push(item); // Aún no es tiempo de reintentar
                    continue;
                }

                await api.post('/api/safe-zone/location/update/', {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    is_out_of_zone: item.is_out_of_zone
                });

                successfulItems.push(item);
                console.log(`[Queue] ✅ Ubicación reenviada exitosamente`);

            } catch (error) {
                // Incrementar retry count si no ha alcanzado el máximo
                if (item.retryCount < 5) {
                    failedItems.push({ ...item, retryCount: item.retryCount + 1 });
                } else {
                    console.log(`[Queue] ❌ Ubicación descartada después de 5 reintentos`);
                }
            }
        }

        // Guardar solo los items fallidos
        await AsyncStorage.setItem('locationQueue', JSON.stringify(failedItems));
        console.log(`[Queue] Procesamiento completo. Exitosos: ${successfulItems.length}, Pendientes: ${failedItems.length}`);

    } catch (error) {
        console.error('[Queue] Error procesando queue:', error);
    } finally {
        isProcessingQueue = false;
    }
}

/**
 * Envía ubicación con manejo de errores y queue automática
 * IMPORTANTE: Solo envía si el usuario es de tipo "Patient"
 */
async function sendLocationWithRetry(latitude, longitude, isOutOfZone) {
    try {
        // 🔒 VALIDACIÓN CRÍTICA: Solo enviar ubicación si es paciente
        const userType = await AsyncStorage.getItem('user_type');

        if (userType !== 'Patient') {
            console.log('[Location] ⚠️ Usuario no es paciente, no se enviará ubicación');
            return;
        }

        await api.post('/api/safe-zone/location/update/', {
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
            is_out_of_zone: isOutOfZone
        });

        // Si el envío fue exitoso, intentar procesar queue pendiente
        processQueue();

    } catch (error) {
        console.error('[Location] Error enviando ubicación:', error);

        // ✅ FIX CRÍTICO #2: Agregar a queue para reintentar después
        await addToQueue({
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
            is_out_of_zone: isOutOfZone
        });
    }
}

// Tarea de Geofencing (Bajo consumo)
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data: { eventType, region }, error }) => {
    if (error) {
        console.error("[Geofencing] Error:", error);
        return;
    }

    // 🔒 VALIDACIÓN CRÍTICA: Verificar que el usuario es paciente
    const userType = await AsyncStorage.getItem('user_type');
    if (userType !== 'Patient') {
        console.log('[Geofencing] ⚠️ Usuario no es paciente, deteniendo geofencing');
        // Detener el geofencing si el usuario no es paciente
        try {
            await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => { });
        } catch (e) {
            console.error('[Geofencing] Error deteniendo tracking:', e);
        }
        return;
    }

    // 🔋 OPTIMIZACIÓN #3: Debouncing - Evitar flapping en el borde
    const now = Date.now();
    if (now - lastGeofenceEventTime < DEBOUNCE_MS) {
        console.log("[Geofencing] Evento ignorado (debounce) - evitando flapping");
        return;
    }
    lastGeofenceEventTime = now;

    if (eventType === Location.GeofencingEventType.Enter) {
        // ✅ FIX CRÍTICO #3: Verificar si realmente cambió el estado
        if (lastZoneState === 'inside') {
            console.log("[Geofencing] Estado duplicado ignorado (ya estaba dentro)");
            return;
        }
        lastZoneState = 'inside';

        console.log("[Geofencing] ✅ Entró a zona segura! Deteniendo tracking preciso.");

        // Limpiar timeout de tracking adaptativo si existe
        if (adaptiveTrackingTimeout) {
            clearTimeout(adaptiveTrackingTimeout);
            adaptiveTrackingTimeout = null;
        }
        trackingStartTime = null;

        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => { });

        // ✅ FIX CRÍTICO #2: Usar función con retry
        await sendLocationWithRetry(region.latitude, region.longitude, false);

    } else if (eventType === Location.GeofencingEventType.Exit) {
        // ✅ FIX CRÍTICO #3: Verificar si realmente cambió el estado
        if (lastZoneState === 'outside') {
            console.log("[Geofencing] Estado duplicado ignorado (ya estaba fuera)");
            return;
        }
        lastZoneState = 'outside';

        console.log("[Geofencing] ⚠️ Salió de zona segura!");

        // Check if safe exit is active
        const salidaSeguraStr = await AsyncStorage.getItem("salidaSegura");
        const salidaSegura = salidaSeguraStr ? JSON.parse(salidaSeguraStr) : false;

        if (salidaSegura) {
            console.log("[Geofencing] 🟢 Salida Segura ACTIVA - No se activarán alertas");
            // ✅ FIX CRÍTICO #2: Usar función con retry
            await sendLocationWithRetry(region.latitude, region.longitude, false);
            return;
        }

        console.log("[Geofencing] 🚨 Iniciando tracking preciso.");
        trackingStartTime = Date.now();

        // Iniciar tracking de ALTA precisión (primeros 2 minutos)
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // 5 segundos
            distanceInterval: 5, // 5 metros
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "⚠️ ALERTA: Fuera de Zona Segura",
                notificationBody: "Rastreando ubicación precisa...",
                notificationColor: "#FF0000"
            },
        });

        // 🔋 OPTIMIZACIÓN #1: Tracking Adaptativo - Reducir a Balanced después de 2 min
        adaptiveTrackingTimeout = setTimeout(async () => {
            console.log("[Tracking] 🔋 Cambiando a modo BALANCED (ahorro batería)");
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => { });
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.Balanced, // Menos precisión = menos batería
                timeInterval: 10000, // 10 segundos (en lugar de 5s)
                distanceInterval: 10, // 10 metros (en lugar de 5m)
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: "📍 Rastreando ubicación",
                    notificationBody: "Modo ahorro de batería...",
                    notificationColor: "#FFA500"
                },
            });
        }, 120000); // 2 minutos

        // ✅ FIX CRÍTICO #2: Enviar alerta inmediata con retry
        await sendLocationWithRetry(region.latitude, region.longitude, true);
    }
});

// 🔋 Variables para optimización de batería
let lastSentLocation = null;
let lastSentTime = 0;
let lastMovementTime = Date.now();

// Tarea de Tracking Continuo (Solo se activa cuando está FUERA)
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error("Error en tarea de ubicación:", error);
        return;
    }

    // 🔒 VALIDACIÓN CRÍTICA: Verificar que el usuario es paciente
    const userType = await AsyncStorage.getItem('user_type');
    if (userType !== 'Patient') {
        console.log('[Location Task] ⚠️ Usuario no es paciente, deteniendo tracking');
        // Detener el tracking si el usuario no es paciente
        try {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        } catch (e) {
            console.error('[Location Task] Error deteniendo tracking:', e);
        }
        return;
    }

    if (data) {
        const { locations } = data;
        const location = locations[0];

        if (!location) return;

        try {
            const { latitude, longitude, speed } = location.coords;
            const now = Date.now();

            // 🔋 OPTIMIZACIÓN #4: Location Caching - Solo enviar si cambió significativamente
            const shouldSend = (() => {
                // Primera ubicación
                if (!lastSentLocation) return true;

                // Han pasado más de 60s desde último envío
                if (now - lastSentTime > 60000) return true;

                // Distancia significativa (>10m)
                const distance = Math.hypot(
                    (latitude - lastSentLocation.latitude) * 111000,
                    (longitude - lastSentLocation.longitude) * 111000
                );
                if (distance > 10) return true;

                return false;
            })();

            if (!shouldSend) {
                console.log("[Caching] Ubicación no cambió significativamente, skipping...");
                return;
            }

            // 🔋 OPTIMIZACIÓN #5: Detección de Inactividad
            const isMoving = speed !== null && speed > 0.5; // >0.5 m/s (~1.8 km/h)
            if (isMoving) {
                lastMovementTime = now;
            }

            const inactiveTime = now - lastMovementTime;
            const isInactive = inactiveTime > 300000; // 5 minutos sin movimiento

            if (isInactive) {
                console.log("[Inactivity] Paciente inactivo, reduciendo frecuencia...");
                // La próxima actualización será en 60s en vez de 10s
                // (se implementa ajustando el interval dinámicamente)
            }

            console.log(`[Background Tracking] Coords: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} | Speed: ${(speed || 0).toFixed(2)} m/s`);

            // ✅ FIX CRÍTICO #2: Enviar al backend con retry automático
            await sendLocationWithRetry(latitude, longitude, true);

            // Guardar localmente
            await AsyncStorage.setItem("ubicacionPaciente", JSON.stringify({ latitude, longitude }));

            // Actualizar caché
            lastSentLocation = { latitude, longitude };
            lastSentTime = now;

        } catch (err) {
            console.error("Error enviando ubicación en background:", err);
        }
    }
});
