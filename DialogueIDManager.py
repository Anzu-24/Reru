import json
import os


# =========================
# 設定
# =========================

DIALOGUE_FOLDER = "./dialogue"

OUTPUT_FOLDER = "../dialogue_fixed"


# ファイル番号
CATEGORY_MAP = {
    "00_common": "00",
    "01_mood": "01",
    "02_time": "02",
    "03_weather": "03",
    "04_season": "04",
    "05_calendar": "05",
    "06_anniversary": "06",
}


# =========================
# ID生成
# =========================

def create_id(category, number):

    return (
        category +
        str(number).zfill(8)
    )


# =========================
# メイン処理
# =========================

def process_file(filename):

    name = filename.replace(".json","")

    if name not in CATEGORY_MAP:
        print(
            "skip:",
            filename
        )
        return


    category = CATEGORY_MAP[name]


    input_path = os.path.join(
        DIALOGUE_FOLDER,
        filename
    )


    try:
        with open(
            input_path,
            "r",
            encoding="utf-8-sig"
        ) as f:

            data = json.load(f)


    except Exception as e:

        print(
            "読み込み失敗:",
            filename
        )

        print(e)

        return

    # ID振り直し

    for index,item in enumerate(
        data,
        start=1
    ):

        item["id"] = create_id(
            category,
            index
        )



    save_path=os.path.join(
        OUTPUT_FOLDER,
        filename
    )


    os.makedirs(
        OUTPUT_FOLDER,
        exist_ok=True
    )


    with open(
        save_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=2
        )



    print(
        "complete:",
        filename,
        len(data),
        "items"
    )



# =========================
# 実行
# =========================


files=os.listdir(
    DIALOGUE_FOLDER
)


for file in files:

    if file.endswith(".json"):

        process_file(file)



print(
    "\nID整理完了"
)