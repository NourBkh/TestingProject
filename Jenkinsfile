pipeline {
    agent any

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        CHROMEDRIVER_BIN = '/usr/local/bin/chromedriver'
        PATH = "/usr/local/bin:${env.PATH}"
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

        stage('Start Backend') {
            steps {
                dir('backend') {
                    sh 'nohup node server.js > backend.log 2>&1 &'  // Runs backend in background
                }
                sh 'sleep 10'  // Wait for backend to start
            }
        }

        stage('Start Frontend') {
            steps {
                dir('frontend') {
                    sh 'nohup npm start > frontend.log 2>&1 &'  // Runs frontend in background
                }
                sh 'sleep 10'  // Wait for frontend to start
            }
        }

        stage('Verify Application is Running') {
            steps {
                sh '''
                    curl --retry 10 --retry-delay 5 --retry-connrefused -I http://localhost:3000
                '''
            }
        }

        stage('Run Selenium UI Test') {
            steps {
                sh 'npm test || exit 1'  // Fail pipeline if UI test fails
            }
        }
    }
}
