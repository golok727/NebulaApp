// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod nebula;
mod state;
mod utils;

mod handlers;
use handlers::{notebook, page, window};
use state::AppState;
use std::sync::{Arc, Mutex};
use tauri::Manager;
use utils::Application;
use window_shadows::set_shadow;

fn main() {
    Application::initialize_app();
    let app_state = Arc::new(Mutex::new(AppState::new()));

    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            set_shadow(&main_window, true).unwrap();
            Ok(())
        })
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            notebook::create_nebula_notebook,
            notebook::load_nebula_notebooks,
            notebook::load_nebula_notebook,
            notebook::save_notebook,
            page::load_page,
            page::add_page,
            page::update_page,
            window::open_settings_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
