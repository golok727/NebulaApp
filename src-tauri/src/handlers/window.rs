use tauri::{LogicalSize, Manager, Size};
use window_shadows::set_shadow;
#[tauri::command]
pub async fn open_settings_window(handle: tauri::AppHandle) {
    match handle.get_window("settings") {
        Some(settings_window) => {
            settings_window.set_focus().unwrap();
        }
        _ => {
            let settings_window = tauri::WindowBuilder::new(
                &handle,
                "settings",
                tauri::WindowUrl::App("/settings".into()),
            )
            .build()
            .unwrap();
            settings_window.set_title("Settings").unwrap();
            settings_window.set_decorations(false).unwrap();
            settings_window.set_resizable(false).unwrap();
            settings_window
                .set_size(Size::Logical(LogicalSize {
                    height: 500.0,
                    width: 700.0,
                }))
                .unwrap();

            set_shadow(&settings_window, true).unwrap();

            settings_window.show().unwrap();
            settings_window.set_focus().unwrap();
        }
    };
}
