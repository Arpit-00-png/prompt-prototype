# Disk Space Cleanup Guide

## Quick Fixes (Already Done)
✅ Cleared npm cache
✅ Removed node_modules (if existed)
✅ Removed .next build folder (if existed)
✅ Cleared temp files

## Additional Cleanup Steps

### 1. Clear More npm Cache Locations
```powershell
# Clear npm cache completely
npm cache clean --force

# Clear yarn cache (if you use yarn)
yarn cache clean

# Clear pnpm cache (if you use pnpm)
pnpm store prune
```

### 2. Clear Windows Update Cache
```powershell
# Run as Administrator
Stop-Service wuauserv
Remove-Item -Recurse -Force "$env:SystemRoot\SoftwareDistribution\Download\*"
Start-Service wuauserv
```

### 3. Clear Browser Caches
- Chrome: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache`
- Edge: `%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache`
- Firefox: `%APPDATA%\Mozilla\Firefox\Profiles\*\cache2`

### 4. Clear Recycle Bin
```powershell
Clear-RecycleBin -Force
```

### 5. Use Windows Disk Cleanup
1. Press `Win + R`
2. Type `cleanmgr` and press Enter
3. Select C: drive
4. Check all boxes and click OK

### 6. Move Project to D: Drive (If C: is still full)
Since D: drive has plenty of space, consider:
- Moving your project to D: drive
- Or moving node_modules to D: and using symlinks

### 7. Check for Large Files
```powershell
# Find large files (>100MB) in your user directory
Get-ChildItem $env:USERPROFILE -Recurse -File -ErrorAction SilentlyContinue | 
    Where-Object { $_.Length -gt 100MB } | 
    Sort-Object Length -Descending | 
    Select-Object FullName, @{Name="SizeGB";Expression={[math]::Round($_.Length/1GB, 2)}} | 
    Format-Table -AutoSize
```

### 8. Clear OneDrive Cache (If using OneDrive)
```powershell
# OneDrive cache location
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Microsoft\OneDrive\logs" -ErrorAction SilentlyContinue
```

## After Cleanup

1. **Reinstall Dependencies**
   ```powershell
   cd C:\Users\ADITYA\OneDrive\Desktop\prompt\prompt-prototype
   npm install
   ```

2. **Try Running Dev Server**
   ```powershell
   npm run dev
   ```

## If Still Low on Space

Consider:
- Moving project to D: drive where you have 154GB free
- Using a disk space analyzer tool (like WinDirStat)
- Uninstalling unused programs
- Moving large files to external drive

## Recommended: Move Project to D: Drive

Since D: has plenty of space:
1. Copy entire project folder to D:
2. Work from D: drive location
3. Or use junction/symlink to move node_modules to D:

