pipeline {
    agent any

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        CHROMEDRIVER_BIN = '/usr/local/bin/chromedriver'
        PATH = "/usr/local/bin:${env.PATH}"
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = credentials('sonar')  
        SLACK_CHANNEL = '#build'
        //DOCKER_REGISTRY_URL = 'https://hub.docker.com/repository/docker/nourbkh/testingproject/general'
        //  DOCKER_USERNAME = credentials('dockerhub')
        //  DOCKER_PASSWORD = credentials('dockerhub')
        // MONGO_URI = 'mongodb://username:password@mongodb_host:27017/database'
        // BUILD_TAG = "${env.BUILD_NUMBER}"
        // GIT_BRANCH = "${env.GIT_BRANCH}"
        K8S_CONFIG_REPO_URL = 'https://github.com/NourBkh/k8s-config-repo.git'
        K8S_CONFIG_BRANCH = 'main'
        DOCKER_IMAGE_FRONTEND = 'nourbkh/testingprojectfrontend'
        DOCKER_IMAGE_BACKEND = 'nourbkh/testingprojectbackend'
        GIT_CREDENTIALS_ID = 'TestingProject'  
       // IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()

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

// stage('Start MongoDB') {
//     steps {
//         script {
//             // Start MongoDB container in the background
//             sh 'docker run -d --name mongodb -p 27017:27017 mongo:latest'
//         }
//     }
// }
// stage('Wait for MongoDB') {
//     steps {
//         script {
//             // Wait for MongoDB to be ready
//             sh '''
//                 until docker exec mongodb mongo --eval "db.runCommand({ connectionStatus: 1 })"; do
//                     echo "Waiting for MongoDB to start..."
//                     sleep 5
//                 done
//             '''
//         }
//     }
// }
// stage('Set MongoDB URI') {
//     steps {
//         script {
//             // Set MongoDB URI for backend
//             env.MONGO_URI = 'mongodb://localhost:27017/crud-app'  // Assuming backend connects to MongoDB at localhost
//         }
//     }
// }

stage('Init') {
            steps {
                script {
                    // Get Git commit short hash as IMAGE_TAG
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }


stage('Build Docker Images') {
    steps {
        script {
            echo "Building Docker images for frontend and backend..."
            
            // sh '''
            //     docker build -t nourbkh/testingprojectfrontend:${IMAGE_TAG} -f frontend/Dockerfile frontend/
            //     docker build -t nourbkh/testingprojectbackend:${IMAGE_TAG} -f backend/Dockerfile backend/
            // '''

                    sh """
                        docker build -t ${env.DOCKER_IMAGE_FRONTEND}:${env.IMAGE_TAG} -f frontend/Dockerfile frontend/
                        docker build -t ${env.DOCKER_IMAGE_BACKEND}:${env.IMAGE_TAG} -f backend/Dockerfile backend/
                    """
        }
    }
}


// stage('Cleanup Disk Space') {
//     steps {
//         script {
//             echo "Cleaning up unused Docker images and containers..."
//             sh '''
//                 docker system prune -af
//                 rm -rf /tmp/*
//             '''
//         }
//     }
// }


// stage('Trivy Scan') {
//     steps {
//         script {
//             echo "Running Trivy scan on Docker images..."
//             sh '''
//                 # Set custom cache directory
//                 export TRIVY_CACHE_DIR="/var/lib/trivy"
//                 mkdir -p $TRIVY_CACHE_DIR

//                 # Scan frontend image with minimal mode
//                 trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress --scanners vuln --cache-dir $TRIVY_CACHE_DIR nourbkh/testingprojectfrontend:latest || echo "Vulnerabilities found in frontend image!"

//                 # Scan backend image with minimal mode
//                 trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress --scanners vuln --cache-dir $TRIVY_CACHE_DIR nourbkh/testingprojectbackend:latest || echo "Vulnerabilities found in backend image!"
//             '''
//         }
//     }
// }



// stage('Pull Existing Images') {
//     steps {
//         script {
//             echo "Pulling existing images from Docker Hub..."

//             // Pull the frontend image
//             sh 'docker pull nourbkh/testingprojectfrontend:latest'

//             // Pull the backend image
//             sh 'docker pull nourbkh/testingprojectbackend:latest'

//             // Optionally, pull the MongoDB image (if needed)
//             sh 'docker pull mongo:latest'
//         }
//     }
// }



stage('Push Docker Images to Docker Hub') {
    steps {
        script {
            echo "Pushing Docker images to Docker Hub..."

            // Log in to Docker Hub (make sure credentials are stored in Jenkins)
            withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
            }

            // sh '''
            //     docker push nourbkh/testingprojectfrontend:${IMAGE_TAG}
            //     docker push nourbkh/testingprojectbackend:${IMAGE_TAG}
            // '''

                    sh """
                        docker push ${env.DOCKER_IMAGE_FRONTEND}:${env.IMAGE_TAG}
                        docker push ${env.DOCKER_IMAGE_BACKEND}:${env.IMAGE_TAG}
                    """
    }
}
}


// stage('Update Kubernetes Manifests & Push to Git') {
//     steps {
//         script {
//             echo "Updating Kubernetes deployment manifests with the new Docker images..."

//             // Clone k8s-config-repo
//             sh '''
//                 rm -rf k8s-config-repo
//                 git clone -b ${K8S_CONFIG_BRANCH} ${K8S_CONFIG_REPO_URL} k8s-config-repo
//             '''

//            // Update both frontend and backend images in the deployment file
//             sh '''
//                 sed -i "s|image: ${DOCKER_IMAGE_FRONTEND}:.*|image: ${DOCKER_IMAGE_FRONTEND}:latest|" k8s-config-repo/testingP/deployment.yml
//                 sed -i "s|image: ${DOCKER_IMAGE_BACKEND}:.*|image: ${DOCKER_IMAGE_BACKEND}:latest|" k8s-config-repo/testingP/deployment.yml
//             '''

//             // Commit and push changes
//             withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
//                 sh '''
//                     cd k8s-config-repo
//                     git config user.name "Jenkins CI"
//                     git config user.email "jenkins@automatisation"
//                     git add .
//                     git commit -m "Update Kubernetes deployment with latest images"
//                     git push https://${GIT_USER}:${GIT_PASS}@github.com/YourUser/k8s-config-repo.git ${K8S_CONFIG_BRANCH}
//                 '''
//             }
//         }
//     }
// }




stage('Update Helm Chart & Push to Git') {
    steps {
        script {
            echo "Updating Helm values with the new Docker images..."

            // Clone the Helm config repo
            sh '''
                rm -rf k8s-config-repo
                git clone -b ${K8S_CONFIG_BRANCH} ${K8S_CONFIG_REPO_URL} k8s-config-repo
            '''

            // Update values files with the new image tags
            // sh '''
            //     sed -i "s|repository: .*testingprojectfrontend.*|repository: ${DOCKER_IMAGE_FRONTEND}|" k8s-config-repo/helmTestingP/testingprojectHelm/values-frontend.yaml
            //     sed -i "s|repository: .*testingprojectbackend.*|repository: ${DOCKER_IMAGE_BACKEND}|" k8s-config-repo/helmTestingP/testingprojectHelm/values-backend.yaml
            // '''


//             sh """
//     sed -i "s|tag: .*|tag: ${IMAGE_TAG}|" k8s-config-repo/helmTestingP/testingprojectHelm/values-frontend.yaml
//     sed -i "s|tag: .*|tag: ${IMAGE_TAG}|" k8s-config-repo/helmTestingP/testingprojectHelm/values-backend.yaml
// """


                    sh """
                        sed -i "s|tag: .*|tag: ${env.IMAGE_TAG}|" k8s-config-repo/helmTestingP/testingprojectHelm/values-frontend.yaml
                        sed -i "s|tag: .*|tag: ${env.IMAGE_TAG}|" k8s-config-repo/helmTestingP/testingprojectHelm/values-backend.yaml
                    """

            // Commit and push the updates
            withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                sh '''
    cd k8s-config-repo
    git config user.name "Jenkins CI"
    git config user.email "jenkins@automatisation"
    git add .
    if git diff --quiet; then
        echo "No changes to commit."
    else
        git commit -m "Update Helm values with latest image tags"
        git push https://${GIT_USER}:${GIT_PASS}@github.com/NourBkh/k8s-config-repo.git ${K8S_CONFIG_BRANCH}
    fi
'''
            }
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




