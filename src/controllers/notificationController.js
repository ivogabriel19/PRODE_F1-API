import Notification from '../models/notification.js';

/**
 * @desc    Obtener notificaciones del usuario logueado
 * @route   GET /api/notifications
 * @access  Private
 */
export async function getNotificaciones(req, res) {
  try {
    // CAMBIO: Usar req.user.id (provisto por el middleware 'protect')
    const notificaciones = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notificaciones);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener notificaciones", error: err.message });
  }
}

/**
 * @desc    Marcar una notificación como leída
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export async function checkNotificacion(req, res) {
  try {
    const { id } = req.params; // ID de la Notificación

    // CAMBIO: Usar req.user.id para asegurarse de que solo el dueño la marque
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Solo actualiza si el ID Y el dueño coinciden
      { read: true },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedNotification) {
        return res.status(404).json({ message: "Notificación no encontrada o no te pertenece" });
    }

    res.json({ success: true, notification: updatedNotification });
  } catch (err) {
    res.status(500).json({ message: "Error al marcar como leída", error: err.message });
  }
}