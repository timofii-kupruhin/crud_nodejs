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
					sudo docker rm -f $(docker ps -aq)
					sudo docker rmi -f $(docker images -aq)
					sudo docker volume rm $(docker volume ls -q)
					sudo docker ps -a
					sudo docker volume ls
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
