import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {checkVersions} from './check-versions.mjs';
import {CHANGELOG_PATH,readLatestVersionedChangelogEntry,formatChangelogCommitSubject} from './changelog.mjs';

/** Explicit noninteractive publishing for an already audited, fully staged release. */
export function publishRelease(root,{confirm=false,initial=false}={}) {
  if(!confirm) throw new Error('Release publishing requires --release --yes after review.');
  const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],windowsHide:true}).trim();
  const audit=checkVersions(root);
  if(audit.failures.length) throw new Error(audit.failures.join('\n'));
  const entry=readLatestVersionedChangelogEntry(root),tag='v-'+entry.version;
  if(/Add the verified change details before publishing/.test(readFileSync(root+'/'+CHANGELOG_PATH,'utf8').split(/^## v-/m)[1]??'')) throw new Error('Complete release notes first.');
  if(git(['diff','--name-only']).length) throw new Error('Unstaged tracked changes remain; audit and stage explicitly.');
  if(git(['ls-files','--others','--exclude-standard']).length) throw new Error('Untracked files remain; audit and stage explicitly.');
  if(!git(['diff','--cached','--name-only'])) throw new Error('No staged release changes.');
  git(['diff','--cached','--check']);
  const reviewedTree=git(['write-tree']);
  const branch=git(['symbolic-ref','--short','HEAD']);
  if(initial) {
    if(git(['ls-remote','--heads','origin']))throw new Error('Initial publishing requires an empty remote.');
    try{git(['rev-parse','--verify','HEAD']);throw new Error('Initial publishing requires an unborn local branch.');}catch(error){if(error.message==='Initial publishing requires an unborn local branch.')throw error;}
  }else{
    const upstream=git(['rev-parse','--abbrev-ref','--symbolic-full-name','@{upstream}']);
    if(upstream!=='origin/'+branch) throw new Error('Release requires the matching origin upstream.');
    git(['fetch','--quiet','origin']);
    if(git(['rev-parse','HEAD'])!==git(['rev-parse',upstream])) throw new Error('Upstream changed or unpublished commits exist; review before releasing.');
  }
  if(git(['tag','--list',tag])||git(['ls-remote','--tags','origin','refs/tags/'+tag])) throw new Error('Release tag already exists; never move it.');
  const parent=initial?null:git(['rev-parse','HEAD']);
  if(git(['write-tree'])!==reviewedTree||git(['diff','--name-only'])||git(['ls-files','--others','--exclude-standard']))throw new Error('Release content changed during review.');
  git(['commit','-m',formatChangelogCommitSubject(entry)]);
  if(git(['rev-parse','HEAD^{tree}'])!==reviewedTree||(parent&&git(['rev-parse','HEAD^'])!==parent))throw new Error('Commit hooks changed the reviewed release; push stopped.');
  git(['tag','-a',tag,'-m',formatChangelogCommitSubject(entry)]);
  // Atomic push prevents publishing a branch without its release tag, or vice versa.
  git(['push','--atomic','--set-upstream','origin','HEAD:refs/heads/'+branch,'refs/tags/'+tag]);
  console.log(JSON.stringify({version:entry.version,tag,commit:git(['rev-parse','HEAD'])}));
}
