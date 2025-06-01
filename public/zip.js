/*!
 * JSZip v3.10.1 - A JavaScript class for generating and reading zip files
 * https://stuk.github.io/jszip/
 * (这里示例为精简版核心函数，推荐直接用官方完整版：https://stuk.github.io/jszip/)
 */

class ZipHelper {
    constructor() {
      this.jszip = new JSZip();
    }
  
    async zipFiles(files) {
      const zip = new JSZip();
      files.forEach(file => {
        zip.file(file.name, file);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      return content;
    }
  }
  
  // 你可以直接引入官方 CDN 版本，示例如下：
  // <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
  
  // 如果你希望我帮你直接在 sender.html 引入 CDN，请告诉我！
  