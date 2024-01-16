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
				sh '''
					sudo docker system prune -a
					sudo docker ps -a

					sudo docker volume prune
					sudo docker volume ls

					sudo docker image prune
					sudo docker images

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
