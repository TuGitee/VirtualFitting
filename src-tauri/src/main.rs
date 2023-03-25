#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lazy_static::lazy_static;
use serde::Serialize;
use serde_json::json;
use tauri::Manager;

#[tauri::command]
async fn background(keywords: String) -> String {
    #[derive(Serialize, Clone, Debug)]
    struct Data {
        url: &'static str,
        tags: Vec<&'static str>,
    }

    impl From<(&'static str, Vec<&'static str>)> for Data {
        fn from(value: (&'static str, Vec<&'static str>)) -> Self {
            Self {
                url: value.0,
                tags: value.1,
            }
        }
    }
    lazy_static! {
        static ref DATA_LIST: Vec<Data> = Vec::from([
            ("1.jpg", vec!["海边", "山川"]).into(),
            ("2.jpg", vec!["海边", "礁石", "蓝天"]).into(),
            ("3.jpg", vec!["蓝天", "街道", "现代"]).into(),
            ("4.jpg", vec!["日落", "大海", "夕阳"]).into(),
            ("5.jpg", vec!["蓝天", "白云", "马路"]).into(),
            ("6.jpg", vec!["蓝天", "现代", "车"]).into(),
            ("7.jpg", vec!["石头", "山川"]).into(),
            ("8.jpg", vec!["富士山", "花朵", "纯色"]).into(),
            ("9.jpg", vec!["船舶", "阳光", "海边"]).into(),
        ]);
    }

    if keywords.is_empty() {
        return serde_json::to_string(&DATA_LIST.clone()).unwrap();
    }
    let keywords: Vec<&str> = keywords.split('-').collect();
    let ret = DATA_LIST
        .clone()
        .into_iter()
        .filter(|data| {
            data.tags
                .iter()
                .fold(false, |acc, word| keywords.contains(word) || acc)
        })
        .collect::<Vec<Data>>();
    serde_json::to_string(&ret).unwrap()
}

#[tauri::command]
async fn list() -> String {
    lazy_static! {
        static ref LIST: serde_json::Value = json! {[
            { "value": "海边沙滩", "tags": ["海边", "沙滩", "阳光"] },
            { "value": "纯色风格", "tags": ["纯色", "静谧", "灵动", "压抑"] },
            { "value": "古典建筑", "tags": ["古典", "建筑", "都市", "乡村"] },
            { "value": "繁华都市", "tags": ["都市", "现代", "繁华"] },
            { "value": "夜晚路边", "tags": ["马路", "路灯", "夜晚"] },
            { "value": "傍晚夕阳", "tags": ["傍晚", "夕阳", "山川", "天际线"] },
            { "value": "富士山下", "tags": ["山川", "白色", "山川", "静谧"] },
            { "value": "码头", "tags": ["船舶", "海边", "阳光"] },
            { "value": "机场", "tags": ["飞机", "现代", "都市"] },
            { "value": "火车站", "tags": ["火车", "现代", "都市"] },
            { "value": "汽车站", "tags": ["汽车", "现代", "都市"] },
            { "value": "日出海边", "tags": ["海边", "日出"] },
            { "value": "日落海边", "tags": ["海边", "日落"] },
            { "value": "日出山川", "tags": ["山川", "日出"] },
            { "value": "日落山川", "tags": ["山川", "日落"] },
        ]};
    }
    serde_json::to_string(&*LIST).unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![background, list])
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
