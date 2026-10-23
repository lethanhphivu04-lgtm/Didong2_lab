Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('d:\Didong2_lab\Tj\Cafit\Cafit.xd')
$colors = [System.Collections.Generic.HashSet[string]]::new()

foreach ($entry in $zip.Entries) {
    if ($entry.Name.EndsWith('.agc')) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        $matches = [regex]::Matches($text, '"value":\s*(\d{5,10})')
        foreach ($m in $matches) {
            $val = [int64]$m.Groups[1].Value
            $hex = [System.Convert]::ToString($val, 16).PadLeft(6, '0')
            if ($hex.Length -eq 6) {
                [void]$colors.Add('#' + $hex.ToUpper())
            } elseif ($hex.Length -eq 8) {
                [void]$colors.Add('#' + $hex.Substring(2).ToUpper())
            }
        }
    }
}
$zip.Dispose()

$arr = @($colors)
Write-Output "Unique colors ($($colors.Count)): $($arr -join ', ')"
