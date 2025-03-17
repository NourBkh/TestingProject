pipeline {
    agent any

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        CHROMEDRIVER_BIN = '/usr/local/bin/chromedriver'
        PATH = "/usr/local/bin:${env.PATH}"
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = credentials('sonar')  
        SLACK_CHANNEL = '#build'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/NourBkh/TestingProject.git'
            }
        }

        stage('Verify Node.js Installation') {
            steps {
                sh '''
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Chrome for Selenium') {
            steps {
                script {
                    def chromeInstalled = sh(script: 'which google-chrome', returnStatus: true)
                    if (chromeInstalled != 0) {
                        echo 'Installing Google Chrome...'
                        sh '''
                            sudo apt-get update
                            sudo apt-get install -y google-chrome-stable
                        '''
                    } else {
                        echo 'Google Chrome is already installed.'
                    }
                }
            }
        }

        stage('Install ChromeDriver for Selenium') {
            steps {
                script {
                    def chromedriverInstalled = sh(script: 'which chromedriver', returnStatus: true)
                    if (chromedriverInstalled != 0) {
                        echo 'Installing ChromeDriver...'
                        sh '''
                            sudo apt-get install -y chromium-chromedriver
                            sudo apt-get update
                        '''
                    } else {
                        echo 'ChromeDriver is already installed.'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Frontend Dependencies') {
    steps {
        dir('frontend') {
            sh '''
                npm install
                chmod +x node_modules/.bin/react-scripts
            '''
        }
    }
}



        stage('Start Backend') {
            steps {
                dir('backend') {
                    sh 'nohup node server.js > backend.log 2>&1 &'
                }
                sh 'sleep 10'  // Wait for backend to start
            }
        }

        stage('Start Frontend') {
    steps {
        dir('frontend') {
            sh '''
                chmod +x node_modules/.bin/react-scripts
                nohup npm start -- --silent > frontend.log 2>&1 &
            '''
        }
        sh 'sleep 10'
    }
}


        stage('Verify Backend is Running') {
            steps {
                sh '''
                    curl --retry 10 --retry-delay 5 --retry-connrefused -I http://localhost:5000
                '''
            }
        }

        stage('Verify Frontend is Running') {
            steps {
                sh '''
                    curl --retry 10 --retry-delay 5 --retry-connrefused -I http://localhost:3000 || (cat frontend/frontend.log && exit 1)
                '''
            }
        }

     
        //        stage('Check MongoDB Connection') {
        //     steps {
        //         script {
        //             try {
        //                 // Check MongoDB connection using the mongo shell command
        //                 sh 'mongo --eval "db.runCommand({ ping: 1 })"'
        //             } catch (Exception e) {
        //                 echo "MongoDB connection failed!"
        //                 currentBuild.result = 'FAILURE'
        //                 error("MongoDB connection failed!")
        //             }
        //         }
        //     }
        // }


      
 

        stage('Run Selenium UI Test') {
            steps {
                sh 'npm test || exit 1'  // Fail pipeline if UI test fails
            }
        }



  stage('Run SonarQube Analysis') {
    steps {
        script {
            echo 'Running SonarQube Analysis...'
            sh '''
                # Install SonarQube scanner locally
                npm install sonarqube-scanner

                # Run SonarQube analysis using the locally installed scanner
                npx sonar-scanner \
                    -Dsonar.projectKey=TestingProject \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=${SONARQUBE_URL} \
                    -Dsonar.login=${SONARQUBE_TOKEN}
            '''
        }
    }
}

 }


post {
    success {
        // Send success notification to Slack when build and tests pass
        slackSend (
            channel: SLACK_CHANNEL, 
            message: "Build and tests passed successfully for ${env.JOB_NAME} - ${env.BUILD_URL}",
            tokenCredentialId: 'pfe-za54358' // Make sure the token is valid and exists in Jenkins credentials
        )
    }

    failure {
        // Send failure notification to Slack when build or tests fail
        slackSend (
            channel: SLACK_CHANNEL, 
            message: "Build or tests failed for ${env.JOB_NAME} - ${env.BUILD_URL}",
            tokenCredentialId: 'pfe-za54358'
        )
    }

    unstable {
        // Send notification for unstable builds (e.g., tests partially failed)
        slackSend (
            channel: SLACK_CHANNEL, 
            message: "Build is unstable for ${env.JOB_NAME} - ${env.BUILD_URL}",
            tokenCredentialId: 'pfe-za54358'
        )
    }

    always {
        // Optionally, you can send a notification regardless of the build result (success, failure, etc.)
        slackSend (
            channel: SLACK_CHANNEL, 
            message: "Build completed for ${env.JOB_NAME} - ${env.BUILD_URL}",
            tokenCredentialId: 'pfe-za54358'
        )
    }
}






}




