Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('d:\Didong2_lab\Tj\Cafit\Cafit.xd')
$entry = $zip.GetEntry('manifest')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

$json = $content | ConvertFrom-Json
$screens = $json.children[0].children | ForEach-Object { $_.name }
$screens | Out-File -FilePath 'd:\Didong2_lab\scratch\xd_screens.txt' -Encoding utf8
Write-Output "Extracted $($screens.Count) screens"
