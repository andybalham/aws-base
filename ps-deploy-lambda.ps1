param ([string] $StackName, [string] $AppPrefix)

$LambdaZip = "lambda.zip"
$S3Bucket = "agb-app-source"
$S3Key = $StackName + "/" + $LambdaZip
$S3Location = "s3://" + $S3Bucket + "/" + $S3Key

Remove-Item lambda.zip
Set-Location dist
7z a -r ../lambda.zip *
Set-Location ..

aws configure set region eu-west-2 

aws s3 cp $LambdaZip $S3Location

$FunctionList = aws lambda list-functions | ConvertFrom-Json
$Functions = $FunctionList.Functions
$AppFunctions = $Functions | Where-Object {$_.Functionname -match "^" + $AppPrefix + "-"}

Write-Output "Updating stack lambdas..."
$AppFunctions | Foreach-Object {
    aws lambda update-function-code --function-name $_.FunctionName --s3-bucket $S3Bucket --s3-key $S3Key | Out-Null
    Write-Output $_.FunctionName
}
Write-Output "Done"
