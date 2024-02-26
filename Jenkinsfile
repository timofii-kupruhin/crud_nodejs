pipeline {
	agent any
	stages {
		stage('scm checkout') {
            steps {
                checkout scm
            }
        }

		stage ("docker checkout") {
			steps {
				sh '''
					sudo docker version 
					sudo docker info
					sudo docker-compose version
					sudo curl --version 
				'''
			}
		}
		stage ("prune docker containers and volumes") {
			steps {
				script {
                    def containers = sh(script: "sudo docker ps -a -q", returnStdout: true).trim()
                    if (containers) {
                        sh "sudo docker stop $containers"
                    }
                }
				sh '''
    				sudo docker stop $(sudo docker ps -a -q)
					sudo docker system prune -a --volumes
					sudo docker image prune -f
				'''
			}
		}

		stage ("start container") {
			steps {
				sh 'sudo cp /home/ubuntu/.env .'
				sh 'sudo docker-compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d --build'
				sh 'sudo docker ps -a'
			}
		}
	}
}