Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('d:\Didong2_lab\Tj\Cafit\Cafit.xd')
$colors = [System.Collections.Generic.HashSet[string]]::new()
$fonts = [System.Collections.Generic.HashSet[string]]::new()

foreach ($entry in $zip.Entries) {
    if ($entry.Name.EndsWith('.agc')) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        # Regex for hex colors or rgb
        $matches = [regex]::Matches($text, '"value":\s*(\d+)')
        # Regex for font family
        $fontMatches = [regex]::Matches($text, '"family":\s*"([^"]+)"')
        foreach ($fm in $fontMatches) {
            [void]$fonts.Add($fm.Groups[1].Value)
        }
    }
}
$zip.Dispose()

Write-Output "Fonts found: $($fonts -join ', ')"
