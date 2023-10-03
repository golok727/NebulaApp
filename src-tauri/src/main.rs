// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod handlers;
mod migrator;
mod nebula;
mod state;
mod utils;

use handlers::{assets, notebook, page, window};
use mime_guess::MimeGuess;
use state::AppState;
use std::fs;
use std::io::Read;
use std::sync::{Arc, Mutex};
use tauri::http::{header::*, ResponseBuilder};
use tauri::{
    http::{Request, Response},
    AppHandle, Manager,
};
use utils::Application;
use window_shadows::set_shadow;
fn nb_protocol_handler(
    _app: &AppHandle,
    request: &Request,
) -> Result<Response, Box<dyn std::error::Error>> {
    let scope = request
        .uri()
        .strip_prefix("nb://localhost/assets/")
        .unwrap_or_else(|| "/");

    let response_builder = ResponseBuilder::new()
        .status(200)
        .header(ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:1420");

    let asset_file = Application::get_assets_dir().join(scope);

    if asset_file.exists() && asset_file.is_file() {
        let mut file = fs::File::open(&asset_file)?;
        let mut file_data = Vec::new();

        let mime_type = MimeGuess::from_path(&asset_file).first_or_octet_stream();

        file.read_to_end(&mut file_data)?;
        let response = response_builder
            .header(CONTENT_TYPE, mime_type.to_string())
            .header(CACHE_CONTROL, "max-age=3600")
            .body(file_data);
        return response;
    }

    return response_builder
        .status(404)
        .header(CONTENT_TYPE, "text/plain")
        .body("Not found".into());
}
fn main() {
    Application::initialize_app();

    let app_state = Arc::new(Mutex::new(AppState::new()));

    let _ = notebook::recover_meta_data_file();

    tauri::Builder::default()
        .setup(|app| {
            if cfg!(any(windows, target_os = "macos")) {
                let main_window = app.get_window("main").unwrap();
                set_shadow(&main_window, true).unwrap();
            }
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
            page::move_page_to_trash,
            page::delete_page_permanently,
            page::recover_page,
            page::rename_page,
            assets::fetch_assets,
            assets::fetch_assets_for_current_notebook,
            assets::upload_asset,
            window::open_settings_window
        ])
        .register_uri_scheme_protocol("nb", nb_protocol_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
