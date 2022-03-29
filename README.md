# iORA-ERP

## Group Details
**Year/Semester:** AY2122/S2  
**Module:** IS4103  
**Project Group Name:** ID03  
**Member Names:** Goh Hong Pei, Louis Frederick Misson, Remus Kwan Hao Hui, Ruth Chong Jie Ning, Tan Jia Ying Adeline, Wong Peng Yu  

## Deployment Instructions (1st System Release)

### Starting the Spring Boot Application
*Requirements: IDE with Spring Boot Extension pack*  
To start the Spring Boot Application, follow these instructions:  
1. Download [Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-boot-dev-pack) on your favourite IDE.
2. Open the iORA-ERP folder and navigate to [ErpApplication.java](erp\src\main\java\com\iora\erp\ErpApplication.java).
3. Wait for Java Projects to complete loading (bottom right pop-up).
4. Either:  
  a. Click on run above the main method; or  
  b. Open the Spring Boot Dashboard in the Explorer Panel and select run beside the project 'erp'.
5. Hurray! The Maven project will be running in your Terminal/Debug Console.

### Viewing the H2 Database
*Requirements: Browser*  
In the current deployment phase, we have adopted an in-memory SQL database. To access it:
1. Open a browser and navigate to the H2 Console at [http://localhost:8080/h2-console](http://localhost:8080/h2-console).
2. Copy the JDBC address from the console's INFO panel, typicall tagged H2ConsoleAutoConfiguration. The line to copy from should look something like this:

        2022-MM-DD HH:MM:SS.XXX  INFO YYYYY --- [  restartedMain] o.s.b.a.h2.H2ConsoleAutoConfiguration    : H2 console available at '/h2-console'. Database available at 'jdbc:h2:mem:{address}'
3. After copying the JDBC address (i.e. `jdbc:h2:mem:{address}` ), paste it into the JDBC URL input in the H2 console interface with username `sa` and no password to login.

### Running iORA ERP  
*Requirements: Terminal, npm*  
To run the main Enterprise Resource Planning System for the iORA Key System Integration:
1. Navigate into the folder "`/iORA-ERP/react-ui`".
2. Run `npm install` to install the required node modules.
3. Run `npm start` to start the application on port 3000.

### Running iORA E-Commerce Web-app (concurrently)
*Requirements: Terminal, npm*  
To run the E-Commerce Web application for the iORA Key System Integration:
1. Navigate into the folder "`/iORA-ERP/ecommerce`".
2. Run `npm install` to install the required node modules.
3. Run `npm start` to start the application on port 3000.  
**Select Y to launch the E-Commerce concurrently on port 3001.*
4. Do not run both web applications on the same browser as there may be some conflict in the use of localStorage.
