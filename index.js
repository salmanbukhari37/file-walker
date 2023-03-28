import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, basename } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getFileData = (filePath) => {
  const { size, isDirectory, birthtime: createdAt } = fs.statSync(filePath)
  return {
    fileName: basename(filePath),
    filePath: filePath
      .replaceAll('\\', '/')
      .replaceAll(process.env.rootFolder, ' '),
    size,
    isDirectory: isDirectory.call(fs.statSync(filePath)),
    createdAt,
  }
}

const fileRead = async (fileName, path = __dirname) => {
  const directoryPath = join(path, `./${fileName}`)
  var filesObj = {}

  const files = fs.readdirSync(directoryPath)

  files.forEach(async (file) => {
    const filePath = join(directoryPath, `./${file}`)
    const isDirectory = fs.statSync(filePath).isDirectory()
    if (!isDirectory) {
      filesObj[file] = getFileData(filePath)
    } else {
      filesObj[file] = await fileRead(file, directoryPath)
    }
  })
  return filesObj
}

const defaultPath = process.argv[2] || './'
const results = await fileRead(defaultPath)

console.log('results', results)

fs.writeFileSync('data.json', JSON.stringify(results))
