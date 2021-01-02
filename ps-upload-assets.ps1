param ([string] $StackName, [string] $AssetVersion)

aws configure set region eu-west-2 

Get-ChildItem ".\src\appsync" |
Foreach-Object {
    $S3Location = "s3://agb-app-source/$StackName/api-$AssetVersion/" + $_.Name
    aws s3 cp $_.FullName $S3Location
}

Get-ChildItem ".\src\statemachines" |
Foreach-Object {
    $S3Location = "s3://agb-app-source/$StackName/statemachine-$AssetVersion/" + $_.Name
    aws s3 cp $_.FullName $S3Location
}
