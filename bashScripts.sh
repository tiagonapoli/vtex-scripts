
#### GET APP BUNDLE ####
DATA=($(cat $HOME/.config/configstore/vtex.json | python3 -c 'import json,sys;obj=json.load(sys.stdin);print("{} {} {}".format(obj["account"], obj["workspace"], obj["token"]));')) \
&& APPNAME="vtex.link-issue" \
URL="http://apps.aws-us-east-1.vtex.io/${DATA[0]}/${DATA[1]}/apps/${APPNAME}/bundle" \
HEADERS="Authorization:${DATA[2]}" \
OUTPUTDIR="./$APPNAME" \
bash -x -c \
'mkdir $OUTPUTDIR && curl $URL -H "$HEADERS" | tar -xz --directory="$OUTPUTDIR"'