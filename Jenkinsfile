pipeline {
    agent any

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
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

        // stage('Install Chrome for Selenium') {
        //     steps {
        //         sh '''
        //             sudo apt-get update
        //             sudo apt-get install -y google-chrome-stable
        //         '''
        //     }
        // }

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

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'  // Change this if using Flask (use pytest)
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --watchAll=false' // Change if needed
                }
            }
        }


        stage('Run Selenium UI Test') {
            steps {
                sh 'npm test || exit 1'  // Fail pipeline if UI test fails
            }
        }
    }
}
