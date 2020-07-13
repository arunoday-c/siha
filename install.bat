set back=%cd%
for /d %%i in (%cd%\*) do (
cd "%%i"
echo current directory:
cd
if exist package.json npm i
)
cd %back%