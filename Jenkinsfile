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

        stage('Verify Environment Variables') {
            steps {
                sh 'echo "PATH: $PATH"'
                sh 'which node'
                sh 'node -v'
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
                    // Check if Google Chrome is already installed
                    def chromeInstalled = sh(script: 'which google-chrome', returnStatus: true)

                    // If Chrome is not installed, the returnStatus will be non-zero
                    if (chromeInstalled != 0) {
                        echo 'Google Chrome not found. Installing...'
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
                    // Check if chromedriver is installed
                    def chromedriverInstalled = sh(script: 'which chromedriver', returnStatus: true)

                    if (chromedriverInstalled != 0) {
                        echo 'ChromeDriver not found. Installing...'
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

        stage('Install Root Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Verify Paths') {
            steps {
                sh 'echo $PATH'
                sh 'which chromedriver'
                sh 'chromedriver --version'
                sh 'which google-chrome'
                sh 'google-chrome --version'
            }
        }

        stage('Run Selenium UI Test') {
            steps {
                sh 'npm test || exit 1'  // Fail pipeline if UI test fails
            }
        }
    }
}
