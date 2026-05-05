import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixPaths(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = join(dir, file.name);
    
    if (file.isDirectory()) {
      await fixPaths(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Cambiar rutas absolutas a relativas (primero quitar el slash inicial)
      content = content.replace(/href="\/_astro\//g, 'href="_astro/');
      content = content.replace(/src="\/_astro\//g, 'src="_astro/');
      content = content.replace(/href="\/images\//g, 'href="images/');
      content = content.replace(/src="\/images\//g, 'src="images/');
      content = content.replace(/href="\/logo-/g, 'href="logo-');
      content = content.replace(/src="\/logo-/g, 'src="logo-');
      
      // Ahora agregar ./ al inicio de rutas relativas
      content = content.replace(/href="_astro\//g, 'href="./_astro/');
      content = content.replace(/src="_astro\//g, 'src="./_astro/');
      content = content.replace(/href="images\//g, 'href="./images/');
      content = content.replace(/src="images\//g, 'src="./images/');
      content = content.replace(/href="logo-/g, 'href="./logo-');
      content = content.replace(/src="logo-/g, 'src="./logo-');
      
      // Cambiar links internos
      content = content.replace(/href="\/nosotros"/g, 'href="./nosotros/"');
      content = content.replace(/href="\/servicios"/g, 'href="./servicios/"');
      content = content.replace(/href="\/equipo"/g, 'href="./equipo/"');
      content = content.replace(/href="\/sectores"/g, 'href="./sectores/"');
      content = content.replace(/href="\/contacto"/g, 'href="./contacto/"');
      content = content.replace(/href="\/"/g, 'href="./"');
      
      await writeFile(fullPath, content, 'utf-8');
      console.log(`✓ Fixed: ${fullPath}`);
    }
  }
}

fixPaths('./dist').then(() => {
  console.log('\n✅ All paths fixed!');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
