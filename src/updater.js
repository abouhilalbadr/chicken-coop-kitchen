import Swal from 'sweetalert2'
import { isTauri } from '@tauri-apps/api/core'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

// The updater plugin has no dialog of its own; this is the whole flow.
// If this stops working the kitchen screens never update again, so test every change
// to it by updating a real install from the previous version.
export async function checkForUpdate() {
  if (!isTauri()) return

  let update
  try {
    update = await check()
  } catch (error) {
    console.error('Vérification de mise à jour impossible', error)
    return
  }
  if (!update) return

  const { isConfirmed } = await Swal.fire({
    icon: 'info',
    title: `Mise à jour ${update.version} disponible`,
    text: update.body || "L'application va redémarrer après l'installation.",
    showCancelButton: true,
    confirmButtonText: 'Installer maintenant',
    cancelButtonText: 'Plus tard',
  })
  if (!isConfirmed) return

  Swal.fire({
    title: 'Installation en cours…',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading(),
  })

  try {
    // On Windows the installer closes the app itself; relaunch covers macOS.
    await update.downloadAndInstall()
    await relaunch()
  } catch (error) {
    console.error('Échec de la mise à jour', error)
    Swal.fire({
      icon: 'error',
      title: 'Échec de la mise à jour',
      text: "Réessayez au prochain démarrage de l'application.",
    })
  }
}
