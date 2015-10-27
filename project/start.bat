echo '-------------------------start install'

echo '-------------------------npm i -g'
call npm i

echo '-------------------------bower i'
call bower i


echo '-------------------------open browser'
"c:\program files\internet explorer\iexplore" "http://localhost:8000/src/"

echo '-------------------------gulp'
call gulp


echo '-------------------------finished install'