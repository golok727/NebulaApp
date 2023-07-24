use crate::{
    nebula::Header::{FileHeader, FILE_FORMAT_CURRENT_VERSION},
    utils::get_notebook_data_dir,
};
use chrono::Utc;
use serde::{Deserialize, Serialize};

use std::{
    collections::HashMap,
    fs,
    io::{Read, Write},
    path::PathBuf,
};
use uuid::Uuid;
#[derive(Debug, Serialize, Deserialize)]
pub struct PageContent {
    pub doctype: String,
    pub body: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PageEntry {
    pub __id: String,
    pub title: String,
    pub content: PageContent,
    pub created_at: String,
    pub pinned: bool,
    pub starred: bool,
    pub parent_id: Option<String>,
    pub sub_pages: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NebulaNotebook {
    pub __id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub created_at: String,
    pub pages: Vec<String>,
    pub page_map: HashMap<String, PageEntry>,
}
// Page Entry Implementation
impl PageEntry {
    pub fn new(title: String) -> Self {
        PageEntry {
            __id: Uuid::new_v4().to_string(),
            title,
            content: PageContent::new(),
            created_at: Utc::now().to_rfc3339().to_string(),
            pinned: false,
            starred: false,
            parent_id: None,
            sub_pages: Vec::new(),
        }
    }
}
// Content Implementation
impl PageContent {
    fn new() -> Self {
        PageContent {
            doctype: "markdown".to_string(),
            body: "".to_string(),
        }
    }
}

impl NebulaNotebook {
    pub fn new(name: String) -> Self {
        NebulaNotebook {
            __id: Uuid::new_v4().to_string(),
            name,
            thumbnail: None,
            created_at: Utc::now().to_rfc3339().to_string(),
            pages: Vec::new(),
            page_map: HashMap::new(),
        }
    }

    pub fn save_to_file(&self) -> Result<(), String> {
        let notebook_data_dir = get_notebook_data_dir();
        //?  Get the storage Dir and make a new file with the data

        let new_filepath = notebook_data_dir.join(self.__id.clone() + ".nb");
        let mut file =
            fs::File::create(new_filepath).map_err(|err| format!("Error creating file {}", err))?;

        let file_header = FileHeader::new();

        //? Serialize the data and file header
        let serialized_header = bincode::serialize(&file_header)
            .map_err(|err| format!("Error serializing Header{}", err))?;
        let serialized_data =
            bincode::serialize(&self).map_err(|err| format!("Error serializing Data{}", err))?;

        file.write_all(&serialized_header)
            .map_err(|err| format!("Error Writing to file {}", err))?;
        file.write_all(&serialized_data)
            .map_err(|err| format!("Error Writing to file {}", err))?;

        Ok(())
    }

    pub fn _load_from_file(filepath: &PathBuf) -> Result<Self, String> {
        println!("{}", filepath.display());
        match filepath.is_file() {
            true => {
                // ? Read File to buffer
                let mut file = fs::File::open(filepath)
                    .map_err(|err| format!("Error opening file {}", err))?;
                let mut buffer: Vec<u8> = Vec::new();
                file.read_to_end(&mut buffer)
                    .map_err(|err| format!("Error opening file {}", err))?;

                //? Split The header and data Part

                let header_size: usize = std::mem::size_of::<FileHeader>();
                let header_data: &[u8] = &buffer[..header_size];
                let notebook_data: &[u8] = &buffer[header_size..];
                let header: FileHeader = bincode::deserialize::<FileHeader>(&header_data)
                    .map_err(|err| format!("Error retrieving header {}", err))?;
                let file_version = header.__version__;

                // ? Match the file version
                match file_version {
                    FILE_FORMAT_CURRENT_VERSION => {
                        let notebook = bincode::deserialize::<NebulaNotebook>(&notebook_data)
                            .map_err(|err| format!("Error deserializing notebook data {}", err))?;
                        Ok(notebook)
                    }
                    // Handle Migration logic
                    _ => Err("Unsupported version of file".to_string()),
                }
            }
            _ => Err("File not found".to_string()),
        }
    }
}
