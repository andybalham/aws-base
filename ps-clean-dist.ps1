Set-Location dist

Remove-Item * -Force -Recurse

# Get-ChildItem |
#     Select-Object -ExpandProperty FullName |
#     Where-Object {$_ -notlike '*\dist\node_modules'} |
#     # Write-Output
#     Remove-Item -Force 

Set-Location ..

Write-Output "dist cleaned"