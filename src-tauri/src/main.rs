// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod nebula;
mod state;
mod utils;

mod handlers;
use handlers::{notebook, page};
use state::AppState;
use std::sync::{Arc, Mutex};
use utils::Application;
fn main() {
    Application::initialize_app();

    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState::new())))
        .invoke_handler(tauri::generate_handler![
            notebook::create_nebula_notebook,
            notebook::load_nebula_notebooks,
            notebook::load_nebula_notebook,
            page::load_page
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
