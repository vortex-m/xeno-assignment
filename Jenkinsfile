@Library("First") _
pipeline{
    
    agent {label "vinod"}
    
    stages{
        stage("Clone"){
            steps{
                clone("https://github.com/vortex-m/xeno-assignment.git", "main")
            } 
        }
        stage("Build"){
            steps{
                build("xeno:latest")
            }
        }
        stage("Test"){
            steps{
                echo "This is for testing..."
            }
        }
        stage("Push to DockerHub") {
            steps{
                echo "Pushing on Docker Hub..."
                withCredentials([
                    usernamePassword(
                    credentialsId: 'dockerHubCred',
                    usernameVariable: 'dockerHubUser',
                    passwordVariable: 'dockerHubPass'
                )]) {
                    sh '''
                        docker login -u $dockerHubUser -p $dockerHubPass
                        docker image tag xeno:latest $dockerHubUser/xeno:latest
                        docker push $dockerHubUser/xeno:latest
                    '''
                }
            }
        }
        
        stage("Deploy"){
            steps{
                deploy()
            }
        }
    }
}
