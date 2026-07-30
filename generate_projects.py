import os, json
root = r'D:\codes'
out = []
if os.path.exists(root):
    for name in sorted(os.listdir(root)):
        path = os.path.join(root, name)
        # skip hidden/system
        if name.startswith('.'):
            continue
        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.exists(index):
                out.append({'name': name.replace('_',' '),'path': 'file:///' + index.replace('\\','/')})
            else:
                out.append({'name': name.replace('_',' '),'path': 'file:///' + path.replace('\\','/')})
        else:
            if name.lower().endswith('.html'):
                out.append({'name': os.path.splitext(name)[0], 'path': 'file:///' + os.path.join(root,name).replace('\\','/')})

out_path = r'D:\portfolio\projects.json'
with open(out_path,'w',encoding='utf8') as f:
    json.dump(out,f,indent=2,ensure_ascii=False)
print('wrote', len(out), 'projects to', out_path)
