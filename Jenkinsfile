pipeline {
	agent any
	stages {
		stage ("docker checkout") {
			steps {
				sh '''
					docker version 
					docker info
					docker-compose version
					curl --version 
				'''
			}
		}
	}
}