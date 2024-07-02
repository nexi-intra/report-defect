<#---
title: App deploy to production
tag: appdeployproduction
api: post
---
#>

if ((Split-Path -Leaf (Split-Path  -Parent -Path $PSScriptRoot)) -eq "sessions") {
  $path = join-path $PSScriptRoot ".." ".."
}
else {
  $path = join-path $PSScriptRoot ".." ".koksmat/"

}

$koksmatDir = Resolve-Path $path

$inputFile = join-path  $koksmatDir "koksmat.json"

if (!(Test-Path -Path $inputFile) ) {
  Throw "Cannot find file at expected path: $inputFile"
} 
$json = Get-Content -Path $inputFile | ConvertFrom-Json
$version = "v$($json.version.major).$($json.version.minor).$($json.version.patch).$($json.version.build)"
$appname = $json.appname
$imagename = $json.imagename

<#
Envs
#>

$envs = @()
function env($name, $value ) {
  if ($null -eq $value) {
    throw "Environment value for $name is not set"
  }
  return @{name = $name; value = $value }
}



# $envs += env "PNPAPPID" $env:PNPAPPID
# $envs += env "PNPTENANTID" $env:PNPTENANTID
# $envs += env "PNPCERTIFICATE" $env:PNPCERTIFICATE
# $envs += env "PNPSITE" $env:PNPSITE
# $envs += env "SITEURL" $env:SITEURL
$envs += env "NATS" "nats://nats:4222"
$envs += env "POSTGRES_DB" $env:POSTGRES_DB
$configEnv = ""
foreach ($item in $envs) {

  $configEnv += @"
          - name: $($item.name)
            value: $($item.value)

"@
}

<#
Then we build the deployment file
#>

$image = "$($imagename)-app:$($version)"

$config = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $appname-app
spec:
  selector:
    matchLabels:
      app: $appname-app
  replicas: 4
  template:
    metadata:
      labels:
        app: $appname-app
    spec: 
      containers:
      - name: $appname-app
        image: $image
        command: [$appname]
        args: ["service","-v"]               
        env:
$configEnv                           

"@

write-host "Applying config" -ForegroundColor Green

write-host $config -ForegroundColor Gray

$config |  kubectl apply -f -