pipeline {
	agent any
	stages {
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
					sudo docker system prune
					sudo docker volume prune
					sudo docker volume ls
					sudo docker ps -a
				'''
			}
		}

		stage ("start container") {
			steps {
				sh 'docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build'
				sh 'docker ps -a'
			}
		}
	}
}