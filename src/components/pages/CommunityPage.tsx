import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { CommunityDiscussions, NearEarthObjects } from '@/entities';
import { useMember } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function CommunityPage() {
  const { member, isAuthenticated, actions } = useMember();
  const [discussions, setDiscussions] = useState<CommunityDiscussions[]>([]);
  const [neos, setNeos] = useState<Record<string, NearEarthObjects>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedNeoId, setSelectedNeoId] = useState('');
  const [availableNeos, setAvailableNeos] = useState<NearEarthObjects[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDiscussions();
    loadAvailableNeos();
  }, []);

  const loadDiscussions = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<CommunityDiscussions>('communitydiscussions');
    const sortedDiscussions = result.items.sort((a, b) => 
      new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime()
    );
    setDiscussions(sortedDiscussions);

    const neoIds = [...new Set(sortedDiscussions.map(d => d.neoReferenceId).filter(Boolean))];
    const neoData: Record<string, NearEarthObjects> = {};
    
    for (const neoId of neoIds) {
      const allNeos = await BaseCrudService.getAll<NearEarthObjects>('nearearthobjects');
      const neo = allNeos.items.find(n => n.referenceId === neoId);
      if (neo) {
        neoData[neoId!] = neo;
      }
    }
    
    setNeos(neoData);
    setIsLoading(false);
  };

  const loadAvailableNeos = async () => {
    const result = await BaseCrudService.getAll<NearEarthObjects>('nearearthobjects', {}, { limit: 20 });
    setAvailableNeos(result.items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      actions.login();
      return;
    }
    
    if (!newMessage.trim() || !newSubject.trim() || !selectedNeoId) return;

    setIsSubmitting(true);
    
    const newDiscussion: CommunityDiscussions = {
      _id: crypto.randomUUID(),
      neoReferenceId: selectedNeoId,
      authorId: member?._id || 'anonymous',
      subject: newSubject,
      messageContent: newMessage,
      postedAt: new Date().toISOString()
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setNewMessage('');
    setNewSubject('');
    setSelectedNeoId('');

    await BaseCrudService.create('communitydiscussions', newDiscussion);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-12 h-12 text-accentcyan" />
                <h1 className="font-heading text-5xl md:text-6xl">
                  Community Discussions
                </h1>
              </div>
              <p className="font-paragraph text-lg max-w-3xl opacity-90">
                Engage with researchers and space enthusiasts worldwide. Share insights, ask questions, and discuss Near-Earth Objects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* New Discussion Form */}
        <section className="bg-secondary py-12 px-8 md:px-16 border-b border-primary border-opacity-10">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl text-secondary-foreground mb-6">
                Start a Discussion
              </h2>
              
              <form onSubmit={handleSubmit} className="bg-primary text-primary-foreground p-8 rounded-lg">
                <div className="space-y-6">
                  <div>
                    <label className="font-paragraph text-base mb-2 block">
                      Select Asteroid
                    </label>
                    <select
                      value={selectedNeoId}
                      onChange={(e) => setSelectedNeoId(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground border-2 border-primary border-opacity-20 focus:outline-none focus:border-accentcyan transition-colors font-paragraph"
                    >
                      <option value="">Choose an asteroid...</option>
                      {availableNeos.map(neo => (
                        <option key={neo._id} value={neo.referenceId}>
                          {neo.name} ({neo.referenceId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-paragraph text-base mb-2 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="What's your topic?"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground border-2 border-primary border-opacity-20 focus:outline-none focus:border-accentcyan transition-colors font-paragraph"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-base mb-2 block">
                      Message
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your thoughts, questions, or observations..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground border-2 border-primary border-opacity-20 focus:outline-none focus:border-accentcyan transition-colors font-paragraph resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                    className="bg-accentcyan text-primary font-paragraph text-base px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {isAuthenticated ? 'Post Discussion' : 'Sign In to Post'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Discussions List */}
        <section className="py-16 px-8 md:px-16 bg-secondary">
          <div className="max-w-[100rem] mx-auto min-h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : discussions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <MessageSquare className="w-20 h-20 text-secondary-foreground opacity-30 mx-auto mb-6" />
                <h2 className="font-heading text-3xl text-secondary-foreground mb-4">
                  No Discussions Yet
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground opacity-70">
                  Be the first to start a conversation about Near-Earth Objects!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {discussions.map((discussion, index) => {
                  const neo = neos[discussion.neoReferenceId || ''];

                  return (
                    <motion.div
                      key={discussion._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-primary text-primary-foreground p-8 rounded-lg"
                    >
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-accentcyan text-primary flex items-center justify-center">
                            <User className="w-6 h-6" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-heading text-2xl text-accentcyan mb-2">
                                {discussion.subject}
                              </h3>
                              {neo && (
                                <p className="font-paragraph text-sm opacity-70">
                                  Regarding: {neo.name} ({neo.referenceId})
                                </p>
                              )}
                            </div>
                            
                            {discussion.postedAt && (
                              <div className="flex items-center gap-2 text-sm opacity-70">
                                <Clock className="w-4 h-4" />
                                <span className="font-paragraph">
                                  {format(new Date(discussion.postedAt), 'MMM dd, yyyy HH:mm')}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="font-paragraph text-base leading-relaxed opacity-90 mb-4">
                            {discussion.messageContent}
                          </p>

                          <div className="pt-4 border-t border-primary-foreground border-opacity-20">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 opacity-70" />
                              <span className="font-paragraph text-sm opacity-70">
                                Posted by User {discussion.authorId?.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
