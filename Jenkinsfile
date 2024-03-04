
pipeline{
    agent any
    tools{
        jdk 'jdk17'
        nodejs 'node16'
    }
    environment {
        SCANNER_HOME=tool 'sonar-scanner'
    }
    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout from Git'){
            steps{
                git branch: 'frontend', url: 'https://github.com/Boubamahir2/Advanced-E2E-DevSecOps-Three-tier-Project-DigitalOcean.git'
            }
        }
        stage("Sonarqube Analysis "){
            steps{
                
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=jobster_frontend \
                    -Dsonar.projectKey=jobster_frontend '''
                }
          
            }  
        }
        stage("quality gate"){
          steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token' 
                }
            } 
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
          
            }
        }
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
        stage("Docker Build & Push"){
            steps{
                script{
                  withDockerRegistry(credentialsId: 'docker-token', toolName: 'docker'){   
                      sh "docker build -t jobster_frontend ."
                      sh "docker tag jobster_frontend boubamahir/jobster_frontend:latest "
                      sh "docker push boubamahir/jobster_frontend:latest "
                  }
                }
            }
        }
        stage("TRIVY"){
            steps{
                sh "trivy image boubamahir/jobster_frontend:latest > trivyimage.txt" 
            }
        }
        stage('Remove Existing Container'){
            steps{
                script {
                    // Stop and remove the existing container if it exists
                    sh 'docker rm -f jobster_frontend || true'
                }
    }
}
        
        stage('Deploy to container'){
            steps{
                sh 'docker run -d --name jobster_frontend -p 3000:3500 boubamahir/jobster_frontend:latest'
            }
        }
    }
    
    // post {
    //   always {
    //     emailext attachLog: true,
    //       subject: "`${currentBuild.result}` ",
    //       body : "Project: ${env.JOB_NAME} <br/>" +
    //               "Build Number: ${env.BUILD_NUMBER} <br/>" +
    //               "URL: ${env.BUILD_URL} " ,
    //       to : "amamahir2@gmail.com",
    //       attachmentsPattern: "trivyfs.txt, trivyimage.txt"
    //   }
    // }
}


