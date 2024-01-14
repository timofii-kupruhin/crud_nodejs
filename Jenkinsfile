pipeline {
	agent any
	stages {
		stage ("docker checkout") {
			steps {
				sh '''
					sudo su
					docker version 
					docker info
					docker-compose version
					curl --version 
				'''
			}
		}
	}
}