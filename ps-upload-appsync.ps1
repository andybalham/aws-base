param ([string] $StackName, [string] $ApiVersion)

aws configure set region eu-west-2 

Get-ChildItem ".\src\appsync" |
Foreach-Object {
    $S3Location = "s3://agb-app-source/$StackName/api-$ApiVersion/" + $_.Name
    aws s3 cp $_.FullName $S3Location
}
