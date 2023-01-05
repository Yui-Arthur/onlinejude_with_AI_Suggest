import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.apache.commons.io.IOUtils;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;


public class main {

    public static void main(String[] arg) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8002), 0);
        server.createContext("/OJbackstage", new TestHandler());
        server.start();
    }

    static class TestHandler implements HttpHandler{
        @Override
        public void handle(HttpExchange exchange) {

            try{
                //获得表单提交数据(post)
                String postString = IOUtils.toString(exchange.getRequestBody());

                String directoryName = "./question";    // 目標資料夾名稱
                int j = postString.indexOf("filename");
                String filename = "";

                for (int i=j+10;;i++){
                    if(postString.charAt(i)=='.'){
                        break;
                    }
                    filename+=(postString.charAt(i));
                }

                System.out.println("filename "+filename);

                String[] arr = postString.split("\n");
                int index =0;
                for (int i=0;i<arr.length;i++){
                    System.out.println(arr[i]);
                    if (arr[i].length() == 1){
                        index =i;
                        break;
                    }
                }

                String description ="";
                for(int i=index;i<arr.length-1;i++){
                    description+=arr[i]+"\n";
                }

                System.out.println(description);

                File directory = new File(directoryName);   // 建立一個資料夾物件
                if (!directory.exists()) {  // 如果資料夾不存在，則新增它
                    directory.mkdir();
                }

                String path = directoryName+"/"+filename;
                Files.write(Paths.get(path), description.getBytes());
                exchange.sendResponseHeaders(200,0);

            }catch (IOException ie) {

            } catch (Exception e) {

            }
        }
    }

}

