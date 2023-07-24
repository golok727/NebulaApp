//  The nebula file format
pub const FILE_FORMAT_CURRENT_VERSION: u8 = 1;

use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct FileHeader {
    pub __version__: u8,
}
impl FileHeader {
    pub fn new() -> Self {
        FileHeader {
            __version__: FILE_FORMAT_CURRENT_VERSION,
        }
    }
}
