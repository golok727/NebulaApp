use crate::utils::Application;
use crate::{
    state::AppState,
    utils::status::error::{ErrorCode, ErrorResponse},
};
use serde::Serialize;
use std::fs;
use std::sync::{Arc, Mutex};
use tauri::State;
#[derive(Debug, Clone, Serialize)]
pub struct NebulaAsset {
    name: String,
    asset_url: String,
    nb_protocol_url: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct FetchAssetsResponse {
    assets: Vec<NebulaAsset>,
}

#[tauri::command]
pub fn fetch_assets(path: String) -> Result<FetchAssetsResponse, ErrorResponse> {
    let assets_dir = Application::get_assets_dir();

    #[cfg(target_os = "windows")]
    let normalized_path = path.replace("/", "\\");

    let current_path = if path == "/" {
        assets_dir
    } else {
        assets_dir.join(&normalized_path)
    };

    let mut assets: Vec<NebulaAsset> = Vec::new();
    let entries = fs::read_dir(&current_path).map_err(|error| {
        ErrorResponse::new(
            ErrorCode::IoError,
            format!("Error Reading Assets Dir\n Error:{}", &error),
        )
    })?;
    for entry in entries {
        if let Ok(asset) = entry {
            if let Some(filename) = asset.file_name().to_str() {
                let suffix = format!("{}{}", &path, filename);
                let mut asset_url = String::from("https://nb.localhost/assets");
                asset_url.push_str(&suffix);
                let mut nb_protocol_url = String::from("nb://assets");
                nb_protocol_url.push_str(&suffix);

                let nebula_asset = NebulaAsset {
                    name: filename.to_owned(),
                    asset_url,
                    nb_protocol_url,
                };
                assets.push(nebula_asset);
            }
        }
    }

    let res = FetchAssetsResponse { assets };
    Ok(res)
}

//Todo remove this
#[allow(unused_variables)]
#[tauri::command]
pub fn fetch_assets_for_current_notebook(state: State<Arc<Mutex<AppState>>>, path: String) {}
