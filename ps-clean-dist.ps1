Set-Location dist

Get-ChildItem |
    Select-Object -ExpandProperty FullName |
    Where-Object {$_ -notlike 'node_modules'} |
    Remove-Item -force 

Set-Location ..
Write-Output "dist cleaned"