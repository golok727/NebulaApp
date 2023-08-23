use crate::utils::Application;
use crate::{
    state::AppState,
    utils::status::error::{ErrorCode, ErrorResponse},
};
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::prelude::*;
use std::sync::{Arc, Mutex};
use tauri::State;
#[derive(Debug, Clone, Serialize)]
pub struct NebulaAsset {
    name: String,
    asset_url: String,
    nb_protocol_url: String,
    is_new: bool,
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
                    is_new: false,
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

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadAssetPayload {
    __id: String,
    filename: String,
    data: Vec<u8>,
}
#[tauri::command]
pub fn upload_asset(image_data: UploadAssetPayload) -> Result<NebulaAsset, ErrorResponse> {
    let assets_dir = Application::get_assets_dir();
    let mut new_asset = assets_dir.join(&image_data.filename);
    let counter = 0;
    while new_asset.exists() {
        new_asset =
            assets_dir.join(String::from(&image_data.filename).to_owned() + &counter.to_string());
    }
    let mut new_asset_file = fs::File::create(&new_asset).map_err(|err| {
        ErrorResponse::new(ErrorCode::IoError, format!("Error Making Asset {}", err))
    })?;

    new_asset_file.write_all(&image_data.data).map_err(|err| {
        ErrorResponse::new(
            ErrorCode::IoError,
            format!("Error writing to buffer {}", err),
        )
    })?;

    let response = NebulaAsset {
        asset_url: format!("https://nb.localhost/assets/{}", &image_data.filename),
        name: image_data.filename.to_string(),
        nb_protocol_url: format!("nb://assets/{}", &image_data.filename),
        is_new: true,
    };

    Ok(response)
}
