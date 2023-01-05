import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;




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
            System.out.println(exchange.getRequestMethod()); 
            if(exchange.getRequestMethod().equals("GET"))
            {
                byte[] encoded = Files.readAllBytes(Paths.get("index.html"));
                exchange.sendResponseHeaders(200, encoded.length);
                exchange.getResponseHeaders().set("Content-Type", "text/html");
                OutputStream os = exchange.getResponseBody();
                os.write(encoded);
                os.close();
            }
            else
            {
                InputStream requestBody = exchange.getRequestBody();    // 取得client寄過來的檔案內容
                
                String directoryName = "./question/";    // 目標資料夾名稱
                String context = new String(requestBody.readAllBytes(), StandardCharsets.UTF_8);
                String filename = getFileName(context);  // 取得檔案名稱


                String[] temp = filename.split("\\.");

                filename = temp[0];


                File directory = new File(directoryName + filename);
                directory.mkdir();

                String[] parts = context.split("\n");
                String new_content = "";
                for (int i=4;i<parts.length-1;i++)
                {
                    new_content +=parts[i]+"\n";
                }

                FileWriter fw = new FileWriter(directoryName + filename + "/description.txt");
                fw.write(new_content);
                fw.close();
                
                
                Headers responseHeaders = exchange.getResponseHeaders();
                responseHeaders.set("Location", "./OJbackstage");
                exchange.sendResponseHeaders(302,0);
            }
        }
    }
}