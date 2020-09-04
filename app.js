'use strict';
//Node.js に用意されたモジュールを呼び出し
const fs = require('fs');
const readline = require('readline');

// popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成
const rs = fs.createReadStream('./popu-pref.csv');
//readline オブジェクトの input として設定し rl オブジェクトを作成
const rl = readline.createInterface({ input: rs, output: {} });
//key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

//rl オブジェクトで line というイベントが発生したら この無名関数を呼ぶ
rl.on('line', lineString =>{
    //引数 lineString で与えられた文字列をカンマ , で分割して、
    //それを columns という名前の配列に
    const columns = lineString.split(','); 
    const year = parseInt(columns[0]);//年　　変数を文字列から数値へ変換
    const prefecture = columns[1];    //都道府県
    const popu = parseInt(columns[3]);//人口

    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if (!value){
            value = {
                popu10: 0,   //2010年
                popu15: 0,   //2015年
                change: null //変化率
            };
        }
        if (year === 2010){
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
        }
});
rl.on('close',() => {
    //for-of 構文 Map や Array の中身を 
    //of の前で与えられた変数に代入して for ループと同じことができる
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
      }
      //Array.from(prefectureDataMap) の部分で連想配列を普通の配列に変換する処理
      //Array の sort 関数を呼んで無名関数を渡しています。
      //sort に対して渡すこの関数は比較関数と言い、
      //前者の引数 pair1 を 後者の引数 pair2 より前にしたいときは、負の整数、
      //pair2 を pair1 より前にしたいときは、正の整数、
      //pair1 と pair2 の並びをそのままにしたいときは 0 を返す必要があります。
      const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
          return pair2[1].change - pair1[1].change;
      });
      // map 関数は、 Array の要素それぞれを、与えられた関数を適用した内容に変換する
      const rankingString = rankingArray.map(([key,value]) => {
          return(
              key +
              ':' +
              value.popu10 +
              '=>' +
              value.popu15 +
              '変化率:' +
              value.change
          );
      });
    console.log(rankingString);
});

