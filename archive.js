let fs = require('fs')
let archiver = require('archiver')
const { join } = require("path")

let dir = "C:\\Users\\user\\Documents\\StarCraft II\\Accounts\\562435892\\5-S2-1-10961902\\Banks"
dir = dir.split("\\")
dir = join(...dir)
let files = fs.readdirSync(dir)
let regExp = /[.]/

// let dir = "./aaaaa"
// let files = fs.readdirSync(dir)

// 创建文件输出流
let output = fs.createWriteStream(__dirname + '/starcraft.zip')
let archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
})

// 文件输出流结束
output.on('close', function () {
  console.log(`总共 ${archive.pointer()} 字节`)
  console.log('archiver完成文件的归档，文件输出流描述符已关闭')
})

// 数据源是否耗尽
output.on('end', function () {
  console.log('数据源已耗尽')
})

// 存档警告
archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    console.warn('stat故障和其他非阻塞错误')
  } else {
    throw err
  }
})

// 存档出错
archive.on('error', function (err) {
  throw err
})

// 通过管道方法将输出流存档到文件
archive.pipe(output)



let Odir = join( dir)
let path;
let dirArr = [
  {
    dir: Odir
  }
];
function compress(files, dirArr) {
  files.forEach((item, index) => {
    if (index == 0) {
      dirArr[0].path = dirArr[0].dir
      dirArr[index].dir = join(dirArr[index].dir, item)
    }
    else {
      dirArr[index] = {}
      dirArr[index].dir = join(dirArr[0].path, item)
    }
    let aaa = dirArr[index].dir.split("\\")
    dirArr[index].name = aaa[aaa.length - 1]
    // console.log(dirArr);
    if (regExp.test(item)) {
      let Ddir = dirArr[index].dir.replace(dirArr[index].name,'').replace(Odir,'')
      archive.file(dirArr[index].dir, { name:join(...Ddir.split("\\"),item)})
    } else {
      dirArr[index].child = [{}]
      dirArr[index].child[0].dir = dirArr[index].dir
      compress(fs.readdirSync(dirArr[index].dir), dirArr[index].child)
    }
  });
}
compress(files, dirArr)

// 完成归档
archive.finalize()
