const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const multer = require('multer')
const upload = multer({ dest: '/' })

const port = 4000;
app.get('/',(req,res)=>{
  res.send("hello world")
})
/**
 * 
 * @api {get} /api/list
 * @apiName getList
 * @apiGroup list
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {boolean} ok 标识成功字段
 * 
 * @apiParamExample  {} Request-Example:
 * {
 *    
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     ok : true,
 *     data: [
 *            { value: "海边沙滩", tags: ['海边', '沙滩', '阳光'] },
 *            { value: "纯色风格", tags: ['纯色', '静谧', '灵动', '压抑'] }
 *           ]
 * }
 * 
 */
app.get('/list', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send([
    { value: "海边沙滩", tags: ['海边', '沙滩', '阳光'] },
    { value: "纯色风格", tags: ['纯色', '静谧', '灵动', '压抑'] },
    { value: "古典建筑", tags: ['古典', '建筑', '都市', '乡村'] },
    { value: "繁华都市", tags: ['都市', '现代', '繁华'] },
    { value: "夜晚路边", tags: ['马路', '路灯', '夜晚'] },
    { value: "傍晚夕阳", tags: ['傍晚', '夕阳', '山川', '天际线'] },
    { value: "富士山下", tags: ['山川', '白色', '山川', '静谧'] },
    { value: "码头", tags: ['船舶', '海边', '阳光'] },
    { value: "机场", tags: ['飞机', '现代', '都市'] },
    { value: "火车站", tags: ['火车', '现代', '都市'] },
    { value: "汽车站", tags: ['汽车', '现代', '都市'] },
    { value: "日出海边", tags: ['海边', '日出'] },
    { value: "日落海边", tags: ['海边', '日落'] },
    { value: "日出山川", tags: ['山川', '日出'] },
    { value: "日落山川", tags: ['山川', '日落'] },
  ])
})
app.get('/background', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  const dataList = [
    {
      url: "1.jpg",
      tags: ["海边", "山川"]
    },
    {
      url: "2.jpg",
      tags: ["海边", "礁石", "蓝天"]
    },
    {
      url: "3.jpg",
      tags: ["蓝天", "街道", "现代"]
    },
    {
      url: "4.jpg",
      tags: ["日落", "大海", "夕阳"]
    },
    {
      url: "5.jpg",
      tags: ["蓝天", "白云", "马路"]
    },
    {
      url: "6.jpg",
      tags: ["蓝天", "现代", "车"]
    },
    {
      url: "7.jpg",
      tags: ["石头", "山川"]
    },
    {
      url: "8.jpg",
      tags: ["富士山", "花朵", "纯色"]
    },
    {
      url: "9.jpg",
      tags: ["船舶", "阳光", "海边"]
    },
  ]
  const urlObj = new URL(req.url, "http://locahost:3000")
  const keyword = urlObj.searchParams.get('keyword')
  const reg = new RegExp(`^.*[${keyword?.split('-').map((item) => `(?=.*${item}.*)`).join('')}].*$`)
  if (!keyword) res.send(dataList)
  else res.send(dataList.filter((item) => {
    return reg.test(item.tags.join(''))
  }))
})
app.post('/upload', upload.fields(["personImage", "clothesImage", "backgroundImage"]), (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { personImage, clothesImage, backgroundImage } = req.body
  console.log({ personImage, clothesImage, backgroundImage })
  setTimeout(() => {
    res.send({ url: req.body.personImage })
  }, 2000)
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;