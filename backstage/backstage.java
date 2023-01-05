import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class backstage {
    private static final int PORT = 8002;
    public static void main(String[] arg) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/OJbackstage", new Handler());    // 設定HTTP路徑
        server.start(); // 開始監聽
    }

    static class Handler implements HttpHandler{

        private String getFileName(String context) {
            Pattern pattern = Pattern.compile("filename=\"(.+?)\"");
            Matcher matcher = pattern.matcher(context);
            if (matcher.find()) {
                return matcher.group(1);
            }
            return "";
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {  // 當有連線請求時，會使用此函式來處理
            InputStream requestBody = exchange.getRequestBody();    // 取得client寄過來的檔案內容
            exchange.sendResponseHeaders(200, 0);   // 回送狀態碼
            String directoryName = "./question/";    // 目標資料夾名稱
            String context = new String(requestBody.readAllBytes(), StandardCharsets.UTF_8);
            String filename = getFileName(context);  // 取得檔案名稱
            File directory = new File(directoryName);   // 建立一個資料夾物件
            if (!directory.exists()) {  // 如果資料夾不存在，則新增它
                directory.mkdir();
            }

            // 封包處理
            Pattern pattern = Pattern.compile("Content-Type: text/plain\\r\\n\\r\\n((.|\\r|\\n)+?)\\r\\n------------------");
            Matcher matcher = pattern.matcher(context);
            if (matcher.find()) {
                context = matcher.group(1);
            }

            // 寫入檔案
            FileWriter fw = new FileWriter(directoryName + filename);
            fw.write(context);
            fw.close();
        }
    }
}